import Formulario from "./Formulario.jsx";
import { useFormContext } from "../Context/FormContext.tsx";

function Add() {

    const { viewForm, turnViewForm } = useFormContext();

    return (
        <>
            <button onClick={turnViewForm} className="bg-[#2A774C] hover:bg-[#34925d] transition text-white font-semibold p-2 rounded" >
                Agregar tarea
            </button>
            {viewForm && <Formulario/>}
        </>
    )

}

export default Add;