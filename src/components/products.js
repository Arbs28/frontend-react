import React,{ useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import { Table ,TableCell,Modal,Button} from 'semantic-ui-react';

const Products = ()=>{

    const [allProducts,SetAllProducts]=useState([])
    const[openModal,setOpenModal]=useState(false)
    const[editMode,setEditMode]=useState(false)
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

const postProducts=async()=>{
        try {
           await axios.post(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/new-produkt`,  {
                name:name,
                cmimi:cmimi,
                categoryId:category
            })
            clear()
            setOpenModal(false)
            fetchAllProducts()
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


const fetchAllProducts=async()=>{
    try {
       const res = await axios.get(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/all-produkt`)
        SetAllProducts(res.data) 
    } catch (err) {
        console.log(err)
    }
}
useEffect(()=>{
    fetchAllProducts()
    fetchCategories()
},[])

const editProduct=async()=>{
    try {
        await axios.put(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/update-produkt/${editId}`,{
            name:name,
            cmimi:cmimi,
            categoryId:category
        })
        clear()
        fetchAllProducts();
    } catch (err) {
        console.log(err)
    }
}

const deleteProduct=async(id)=>{
    try {
        await axios.delete(`https://egw1r79dz5.execute-api.eu-central-1.amazonaws.com/dev/delete-produkt/${id}`)
        fetchAllProducts();
    } catch (err) {
        
    }
}

return (
    <div>
        <Button onClick={()=>setOpenModal(true)}>Add Product</Button>
        <a href='http://localhost:3000/categories'><Button>Add Category</Button></a>
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