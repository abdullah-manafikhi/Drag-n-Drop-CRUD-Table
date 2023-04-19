import { useState, createContext } from 'react'

const TableContext = createContext()

export const TableProvider = ({ children }) => {

    const [cursor, setCursor] = useState("cursor-grab");
    const [colors, setColors] = useState([])
    const [adding, setAdding] = useState({ isAdding: false, id: null })
    const [addLine, setAddLine] = useState({})
    const [items, setItems] = useState([])
    const [style4, setStyle4] = useState({
        INT: { backgroundColor: "#F0F0F0", color: "#000000" },
        EXT: { backgroundColor: "#F9D949", color: "#000000" },
        DAYS: { backgroundColor: "#3C486B", color: "#000000" }
    })
    const [selectedLine, setSelectedLine] = useState({ location: "test" })
    const [tableInfo, setTableInfo] = useState({})
    const [isSaved, setIsSaved] = useState(true)


    return (
        <TableContext.Provider value={{
            cursor, setCursor,
            colors, setColors,
            adding, setAdding,
            addLine, setAddLine,
            items, setItems,
            style4, setStyle4,
            selectedLine, setSelectedLine,
            tableInfo, setTableInfo,
            isSaved, setIsSaved
        }}>
            {children}
        </TableContext.Provider>
    )
}

export default TableContext