function Project(props) {
    const {allPolygons}= props
    if (!allPolygons?.length) {
        return;
      }
    return (
        <table id="table" className="table">
            <thead>
                <tr className="active-row">
                <th className="id">Id</th>
                <th>Description</th>
                <th>Project Area</th>
                <th>Construction Cost</th>
                </tr>
            </thead>
            <tbody>
                {createTableBody(allPolygons)}
            </tbody>
        </table>
        

    )
}
function createTableBody(allPolygons) {
    const distinctPolygons = new Set();
    let tableBody = [];
    allPolygons.forEach(e => {
        if(!distinctPolygons.has(e.title)) {
            tableBody.push((createRow(e)));
            distinctPolygons.add(e.title);
        }
        
    });
    return tableBody;
}

function createRow(polygon) {
    const {title, properties} = polygon;
    const {TOOLTIP, Shape_Area, ConstructionCost} = properties;
    const description = TOOLTIP?.replaceAll("\\n", ' ') || '';
    return (
        <tr>
          <td>{title}</td>
          <td>{description}</td>
          <td>{Shape_Area}</td>
          <td>{ConstructionCost}</td>
        </tr>
      );
}
export default Project;