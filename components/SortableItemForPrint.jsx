import { useState, useRef, useEffect, useContext } from "react";
import TableContext from "./context/TableContext.js.jsx";

function SortableItemForPrint(props) {
  // this is the table line "row" data
  const [formData, setFormData] = useState(props.line)

  const [style3, setStyle3] = useState({ backgroundColor: "" })

  // getting the table from the context
  const { style4, items } = useContext(TableContext)

 
    // ========== DAYS LINES ===========
    if (props.line.day) {
      return (
        <div style={style4.DAYS} className={`row-grid-day-print touch-manipulation z-1  `} >
          <span className="my-auto font-extrabold">{formData.day}</span>
        </div>
      );
    }
    // ========== NOTES LINES ===========
    else if (props.line.note) {
      return (
        <div style={style4.note} className={`row-grid-day touch-manipulation z-1 `}>
          <span className="my-auto">{formData.note}</span>
        </div>
      );
    }
    // =========== SCENE LINES ===========
    else {
      return (
        <div style={formData.camera === "INT." ? style4.INT : style4.EXT} className={`row-grid touch-manipulation z-1 `}>
          <span className="my-auto">
            <span>{formData.scene}</span>
          </span>
          <span className="my-auto">
            <span>{formData.camera}</span>
          </span>
          <span className="my-auto">
            <span>{formData.summary}</span>
          </span>
          <span className="my-auto">
            <span>{formData.location}</span>
          </span>
          <span className="my-auto">
            <span>{formData.page_length}</span>
          </span>
        </div>
      )
    }
  }

export default SortableItemForPrint;
