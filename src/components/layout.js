import { useEffect, useState } from 'react'
import https from '../config/https.js'
const Layout = ({data}) => {
    const role = data.role
    const [transactions, setTransactions] = useState()
    const [users, setUsers] = useState()
    useEffect(() => {
        if(role === 'customer') {
            getTransaction()
        } else {
            getUsers()
        }
    },[role])
    const getTransaction = () => {
        https.get(`/user/transactions?user_id=${data.user_id}`,{
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          }).then((response) => {
            if(response.data.statusCode && response.data.message === "User Transaction retrieved") {
                setTransactions(response.data.data.transaction)
            }
        }).catch(err => console.log(err))
    }
    const getUsers = () => {
        https.get(`/banker`,{
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          }).then((response) => {
            console.log(response);
            if(response.data.statusCode && response.data.message === "All User retrieved") {
                setUsers(response.data.data.users)
            }
        }).catch(err => console.log(err))
    }
    const getTransactions = () => {
        https.get(`/banker/transactionshistory?user_id=${data.user_id}`,{
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
            }
          }).then((response) => {
            if(response.data.statusCode && response.data.message === "User Transaction retrieved") {

            }
        }).catch(err => console.log(err))
    }
    return <>
    <div className="container d-flex align-items-center flex-column mt-4">
        {role === "customer" &&
        <div className='d-flex justify-content-end align-items-center p-2' style={{width:"100%"}}>
            <button className='btn mr-2'>Desposit</button>
            <button className='btn'>Withdraw</button>
        </div>}
        {role === "customer" ? 
        <table className="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">User Id</th>
                <th scope="col">Amount</th>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                </tr>
            </thead>
            <tbody>
                {transactions &&
                transactions.map((i,index) => 
                    <tr key={index}>
                        <th scope="row">{i.transaction_id}</th>
                        <td>{i.user_id}</td>
                        <td>{i.amount}</td>
                        <td>{new Date(i.transaction_date).toDateString()}</td>
                        <td>{i.transaction_type}</td>
                    </tr>
                    )
                }
            </tbody>
        </table> : <table className="table">
            <thead>
                <tr>
                <th scope="col">User Id</th>
                <th scope="col">Email</th>
                <th scope="col">Name</th>
                <th scope="col">Balance</th>
                </tr>
            </thead>
            <tbody>
                {users &&
                users.map((i,index) => 
                    <tr key={index}>
                        <td>{i.user_id}</td>
                        <td>{i.email}</td>
                        <td>{i.username}</td>
                        <td>{i.balance}</td>
                    </tr>
                    )
                }
            </tbody>
        </table>}
    </div>
    </>
}

export default Layout;