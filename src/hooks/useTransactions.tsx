import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';


interface Transaction {
    id: number,
    amount: number,
    title: string,
    category:string,
    type: string,
    createdAt: Date,
}

// interface TransactionInput{
//     title: string,
//     amount: number,
//     type: string,
//     category:string,
// }
                        //Pick é o contrario de Omit
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderPros{
    children: ReactNode;
}

interface TransactionsContextData{
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
    );
export function TransactionsProvider({ children }: TransactionsProviderPros){
    const [transactions, steTransactions] = useState<Transaction[]>([])

    useEffect(()=> {
        api.get('transactions')
        .then(response => steTransactions(response.data.transactions))
      }, []);

      async function createTransaction(transactionInput: TransactionInput){
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date(),
        })
        const { transaction } = response.data

        steTransactions([
            ...transactions,
            transaction,
        ])
      }

      return(
          <TransactionsContext.Provider value={{transactions, createTransaction}}>
              { children }
          </TransactionsContext.Provider>
      )
}

export function useTransactions(){
    const constext = useContext(TransactionsContext);

    return constext;
}