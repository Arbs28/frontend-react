import React,{ useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import { Table ,TableCell,Modal,Button} from 'semantic-ui-react';

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
        try {
           await axios.post(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/newCategory`,  {
                categoryName:name,
            })
            clear()
            setOpenModal(false)
            fetchCategories()
        } catch (err) {
            console.log(err)
        }
    }
    const fetchCategories=async()=>{
        try {
           const category = await axios.get(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/allCategories`)
            setAllCategories(category.data) 
        } catch (err) {
            console.log(err)
        }
    }

useEffect(()=>{
    fetchCategories()
},[])



const editCategory=async()=>{
    try {
        await axios.put(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/update-category/${editId}`,  {
            categoryName:name,
        }) 
        clear();
        fetchCategories()
    } catch (err) {
        console.log(err)
    }
}

const deleteCategory=async(id)=>{
    try {
        await axios.delete(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/deleteCategory/${id}`)
        fetchCategories();
    } catch (err) {
        
    }
}

return (
    <div>
        <Button onClick={()=>setOpenModal(true)}>Add Category</Button>
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