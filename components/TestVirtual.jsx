import { List, AutoSizer } from 'react-virtualized';
import { DATA } from '../assets/data2'


function testVirtual() {
    if (typeof (window) !== "undefined") {
        console.log(DATA.table_content);
    }
    return (
        <div style={{width: "100%", height: "100vh"}}>
            <AutoSizer>
                {({width, height}) => (
                    <List width={width} height={height} rowHeight={50} rowCount={97} rowRenderer={({ key, index, style, parent }) => {
                        return (
                            <div key={key} style={style}>{DATA.table_content[index].location}</div>
                        )
                    }} />
                )}
            </AutoSizer>
        </div>
    )
}

export default testVirtual