import React,{ useEffect, useState} from 'react';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import { Table ,TableCell,Modal,Button} from 'semantic-ui-react';
import {useHistory} from 'react-router-dom'
import { API,Auth } from 'aws-amplify';

const Products = ()=>{

    const history = useHistory()

    const[allProducts,SetAllProducts]=useState([])
    const[openModal,setOpenModal]=useState(false)
    const[cmimi,setCmimi]=useState("")
    const[name,setName]=useState("")
    const[category,setCategory]=useState("")
    const[allCategories,setAllCategories]=useState([])
    const[editId,setEditId]=useState("")
    
const clear = ()=>{
    setName("")
    setCmimi("")
    setCategory("")
    setOpenModal(false)
    setEditId("")
}
useEffect(()=>{
    fetchAllProducts()
    fetchCategories()
},[])

async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

const postProducts=async()=>{
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestInfo = {
        headers: {
            Authorization: token
        }
      }
        try {
           await axios.post(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/newProduct`,  {
                name:name,
                cmimi:cmimi,
                categoryId:category
            },requestInfo)
            clear()
            setOpenModal(false)
            fetchAllProducts()
        } catch (err) {
            console.log(err)
        }
    }
    const fetchCategories=async()=>{
        const user = await Auth.currentAuthenticatedUser()
        const token = user.signInUserSession.idToken.jwtToken
        const requestInfo = {
            headers: {
                Authorization: token
            }
          }
        try {
           const category = await axios.get(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/categories`,requestInfo)
            setAllCategories(category.data) 
        } catch (err) {
            console.log(err)
        }
    }


const fetchAllProducts=async()=>{
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestInfo = {
        headers: {
            Authorization: token
        }
      }
    try {
       const res = await axios.get(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/products`,requestInfo)
        SetAllProducts(res.data) 
    } catch (err) {
        console.log(err)
    }
}

const editProduct=async()=>{
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestInfo = {
        headers: {
            Authorization: token
        }
      }
    try {
        await axios.put(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/products/put/${editId}`,{
            name:name,
            cmimi:cmimi,
            categoryId:category
        },requestInfo)
        clear()
        fetchAllProducts();
    } catch (err) {
        console.log(err)
    }
}

const deleteProduct=async(id)=>{
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestInfo = {
        headers: {
            Authorization: token
        }
      }
    try {
        await axios.delete(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/product/delete/${id}`,requestInfo)
        fetchAllProducts();
    } catch (err) {
        console.log(err)
    }
}
return (
    <div>
        <Button onClick={()=>setOpenModal(true)} style={{margin:"10px"}}>Add Product</Button>
            <Button onClick={()=>history.push("/categories")} style={{margin:"10px"}}>Add Category</Button>
            <Button onClick={signOut} style={{float:"right",margin:"10px"}}>Sign Out</Button>
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Product Price</Table.HeaderCell>
                    <Table.HeaderCell>Category</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {allProducts.map((data) => {
                    return (
                        <Table.Row key={data._id}>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.cmimi}</TableCell>
                        <TableCell>{data.categoryId?.categoryName}</TableCell>
                        <TableCell>
                            <Button onClick={ ()=>{
                                setEditId(data._id)
                                setName(data.name)
                                setCmimi(data.cmimi)
                                setCategory(data.categoryId?._id)
                                setOpenModal(true)}}>Edit</Button>
                            <Button onClick={()=>deleteProduct(data._id)}>Delete</Button>
                        </TableCell>
                        </Table.Row>
                    )
                })}
            
            </Table.Body>
        </Table>
        <Modal 
   onClose={() => setOpenModal(false)}
   onOpen={() => setOpenModal(true)}
   open={openModal}
>

    <div style={{margin:"10px"}}>
            <label>Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)}/>
    </div>
    <div style={{margin:"10px"}}>
            <label>Cmimi</label>
            <input value={cmimi} onChange={(e)=>setCmimi(e.target.value) }/>
    </div>
    <div style={{margin:"10px"}}>
            <label>Category</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
            {
                allCategories.length> 0 ? allCategories.map((cat)=>{
                    return(
                        <option value={cat._id}>{cat.categoryName}</option>
                    )
                }):""
            }
      </select>
    </div>
    <Button onClick={editId === "" ? postProducts : editProduct}>Save</Button>
    <Button onClick={
        ()=>{
    clear()
    setOpenModal(false)
        }}>
            Cancel</Button>
    </Modal>
    </div>
)
 }
            export default Products