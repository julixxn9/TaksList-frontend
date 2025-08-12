import Task from "./components/Taks.tsx";
import { useTaks } from "./Context/TaksContext.tsx";
import Add from "./components/Add.jsx";
// import datos from "./data/datos.js";

function App() {

  const { taks } = useTaks();

  return (
    
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800">Taks List</h1>
        <Add/>
        <select className="bg-blue-100 border border-blue-300 rounded-md px-4 py-2 text-blue-700 font-medium shadow-sm hover:shadow-md transition duration-200 focus:outline-none">
          <option value="todas">Todas</option>
          <option value="completadas">Completadas</option>
          <option value="noCompletadas">No Completadas</option>
        </select>
      </div>
      <ul className="flex flex-col gap-6">
        {taks.map((nota, index) => {
          return (
          <li key={index}>
            <Task tareaProp={nota} />
          </li>
          );
      })}
      </ul>
    </div>
  );
}

export default App;
