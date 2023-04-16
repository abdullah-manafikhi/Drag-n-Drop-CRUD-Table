import { useState, createContext } from 'react'

const TableContext = createContext()

export const TableProvider = ({ children }) => {

    const [cursor, setCursor] = useState("cursor-grab");
    const [colors, setColors] = useState([])
    const [adding, setAdding] = useState({isAdding : false, id: null})
    const [addLine, setAddLine] = useState({})
    const [items, setItems] = useState([])

    return (
        <TableContext.Provider value={{ cursor, setCursor, colors, setColors, adding, setAdding, addLine, setAddLine, items, setItems }}>
            {children}
        </TableContext.Provider>
    )
}

export default TableContext