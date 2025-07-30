type TransactionType= {
  title: string;
  name: string;
  amount: number;
}

export default function TransactionCard({ transactions }: {transactions: TransactionType[]}) {
  const renderTransactionCards = () => {
    return transactions.map((transaction, index) => (
      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <div>
          <p className="font-medium">{transaction.title}</p>
          <p className="text-sm text-gray-500">{transaction.name}</p>
        </div>  
        <span className="font-semibold text-green-600">+${transaction.amount}</span>
      </div>
    ))
  }

  return (
    <div>
      {renderTransactionCards()}
    </div>
  )
}