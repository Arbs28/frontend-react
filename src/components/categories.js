import React,{ useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import { Table ,TableCell,Modal,Button} from 'semantic-ui-react';
import { Auth } from 'aws-amplify';

async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}


const Category = ()=>{

    const [allCategories,setAllCategories]=useState([])
    const[openModal,setOpenModal]=useState(false)
    const[editId,setEditId]=useState("")
    const[name,setName]=useState("")

const clear = ()=>{
    setName("")
    setOpenModal(false)
    setEditId("")
}

const postCategories=async()=>{
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestInfo = {
        headers: {
            Authorization: token
        }
      }
        try {
           await axios.post(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/newCategory`,  {
                categoryName:name,
            },requestInfo)
            clear()
            setOpenModal(false)
            fetchCategories()
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

useEffect(()=>{
    fetchCategories()
},[])



const editCategory=async()=>{
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestInfo = {
        headers: {
            Authorization: token
        }
      }
    try {
        await axios.put(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/category/put/${editId}`,  {
            categoryName:name,
        },requestInfo) 
        clear();
        fetchCategories()
    } catch (err) {
        console.log(err)
    }
}

const deleteCategory=async(id)=>{
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    const requestInfo = {
        headers: {
            Authorization: token
        }
      }
    try {
        await axios.delete(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/category/delete/${id}`,requestInfo)
        fetchCategories();
    } catch (err) {
        
    }
}

return (
    <div>
        <Button onClick={()=>setOpenModal(true)} style={{margin:"10px"}}>Add Category</Button>
        <Button onClick={signOut} style={{float:"right" ,margin:"10px"}}>Sign Out</Button>
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Category Name</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {allCategories.map((data) => {
                    return (
                        <Table.Row key={data.categpry_id}>
                        <TableCell>{data.categoryName}</TableCell>
                        <TableCell>
                            <Button onClick={ ()=>{
                            setEditId(data._id)
                                setName(data.categoryName)
                                setOpenModal(true)}}>Edit</Button>
                            <Button onClick={()=>deleteCategory(data._id)}>Delete</Button>
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
  
    <Button onClick={editId === "" ? postCategories : editCategory}>Save</Button>
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
        export default Category