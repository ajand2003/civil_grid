function ChargerData(props) {
    const {allMarkers, chargerToPolygons}= props
    if (!allMarkers?.length || !chargerToPolygons?.size) {
        return;
      }
    return (
        <table id="table" className="table">
            <thead>
                <tr className="active-row">
                <th className="id">Id</th>
                <th>Location</th>
                <th>Located in Project Id: </th>
                
                </tr>
            </thead>
            <tbody>
                {createTableBody(allMarkers, chargerToPolygons)}
            </tbody>
        </table>
        

    )
}
function createTableBody(allMarkers, chargerToPolygons) {
    let tableBody = [];
    allMarkers.forEach(e => {
        tableBody.push((createRow(e, chargerToPolygons)));
    });
    return tableBody;
}

function createRow(marker, chargerToPolygons) {
    const {title,  position} = marker;
    let project = chargerToPolygons.get(Number(title));
    if (!project) {
        project = "-";
    }
    const location = position.lat() + ", " + position.lng();
    return (
        <tr>
          <td>{title}</td>
          <td>{location}</td>
          <td>{project}</td>
        </tr>
      );
}
export default ChargerData;