import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'users', user.uid, 'transactions'),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedTransactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setTransactions(loadedTransactions);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []); // Empty dependency array as auth.currentUser is stable enough for initial load, but ideally we'd listen to auth state. 
    // However, App.jsx handles auth state and only renders this provider when user is logged in.

    const addTransaction = async (transaction) => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            await addDoc(collection(db, 'users', user.uid, 'transactions'), {
                ...transaction,
                symbol: transaction.symbol.trim().toUpperCase(),
                date: transaction.date || new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert("Error adding transaction: " + error.message);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No user logged in during delete");
                return;
            }

            if (!id) {
                console.error("No ID provided for delete");
                return;
            }

            const docId = String(id);
            console.log(`Attempting to delete transaction: path=users/${user.uid}/transactions/${docId}`);

            await deleteDoc(doc(db, 'users', user.uid, 'transactions', docId));
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert("Error deleting transaction: " + error.message);
        }
    };

    // proper financial calculations
    const getHoldings = () => {
        const holdings = {};

        // Sort transactions by date (optional but good practice)
        // Firestore creates date strings, sorting there is good, but for calculation we strictly ensuring order
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate holdings
        sorted.forEach(t => {
            const symbol = t.symbol.trim().toUpperCase();
            if (!holdings[symbol]) {
                holdings[symbol] = {
                    symbol,
                    quantity: 0,
                    totalInvested: 0, // for WAC calculation
                    realizedPnL: 0,
                    avgPrice: 0,
                };
            }

            const h = holdings[symbol];

            // Ensure numbers
            const qty = Number(t.quantity);
            const price = Number(t.price);

            if (t.type === 'BUY') {
                const cost = qty * price;
                h.totalInvested += cost;
                h.quantity += qty;
                h.avgPrice = h.totalInvested / h.quantity;
            } else if (t.type === 'SELL') {
                if (h.quantity >= qty) {
                    const costOfSoldShares = h.avgPrice * qty; // basis
                    const saleProceeds = price * qty;

                    h.realizedPnL += (saleProceeds - costOfSoldShares);
                    h.quantity -= qty;
                    h.totalInvested -= costOfSoldShares; // Remove the cost basis of sold shares

                    // If quantity goes to 0, reset avgPrice (or keep history? simpler to reset for now or keep 0)
                    if (h.quantity === 0) {
                        h.avgPrice = 0;
                        h.totalInvested = 0;
                    }
                }
            }
        });

        return Object.values(holdings).filter(h => h.quantity > 0 || h.realizedPnL !== 0);
    };

    const holdings = getHoldings();


    return (
        <PortfolioContext.Provider value={{ transactions, addTransaction, deleteTransaction, holdings, loading }}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    return useContext(PortfolioContext);
}
