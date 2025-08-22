import { useState } from "react";
import type { TaksType } from "../types";
import { useTaks } from "../Context/TaksContext.tsx";

interface CheckBoxProps {
    tareaProp: {
        completada: boolean;
        turnComplete: ()=> void;
    }
}

// Función para formatear fecha y hora de publicación
const obtenerInfoFecha = () => {
  const fecha = new Date(); 
  const opcionesFecha: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const opcionesHora: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: true };

  return {
    fechaCompleta: fecha.toLocaleDateString("es-ES", opcionesFecha),
    hora: fecha.toLocaleTimeString("es-ES", opcionesHora),
  };
};

const CheckBox = ({ tareaProp: {completada, turnComplete } }: CheckBoxProps) => {
  // const { completada, turnComplete } = completeHook;

  return (
    <div
      className={`w-10 aspect-square flex items-center justify-center border-2 rounded-md cursor-pointer transition duration-300
        ${
          completada
            ? "bg-green-300 border-green-500"
            : "bg-blue-100 border-blue-300"
        }`}
      onClick={turnComplete}
    >
      {completada && (
        <img
          src="./check.svg"
          alt="check"
          className="w-full p-1 transition duration-300"
        />
      )}
    </div>
  );
};

interface TaksProps {
    tareaProp: TaksType
}

function Task({ tareaProp }: TaksProps) {
    const { titulo, descripcion, completada, _id } = tareaProp;
    console.log(_id)
  const [more, setMore] = useState(false);
  const { checkTaks, deteleTaks } = useTaks();

  const { fechaCompleta, hora } = obtenerInfoFecha();

  const copyTaks = async () => {
    const copiable = `${titulo}: \n${descripcion}`;
    try {
      await navigator.clipboard.writeText(copiable);
      alert("Tarea copiada al portapapeles");
    } catch (error) {
      console.error("Error al copiar la tarea:", error);
    }
  };

  const turnComplete = () => {
    checkTaks(_id);
  };

  return (
    <div
      className={`flex items-center justify-between bg-white shadow-lg p-5 rounded-xl border border-blue-200
      transition transform duration-300 hover:scale-[1.02] hover:shadow-2xl group`}
    >
      <CheckBox tareaProp={{ completada, turnComplete }} />

      <div
        className={`flex flex-col w-full px-6 cursor-pointer transition-all duration-300 ${
          completada ? "text-gray-400" : "text-gray-800"
        }`}
        onClick={() => setMore(!more)}
      >
        <span
          className={`text-xl font-semibold transition-all duration-300 group-hover:text-blue-600 ${
            completada
              ? "line-through decoration-blue-400 decoration-2 decoration-wavy"
              : ""
          }`}
        >
          {titulo}
        </span>

        <p
          className={`text-sm mt-1 transition-all duration-300 ${
            more ? "line-clamp-none" : "line-clamp-2"
          } ${completada ? "italic text-gray-400" : ""}`}
        >
          {descripcion}
        </p>

        {/* Hora debajo de la descripción */}
        <span className="text-xs mt-2 text-blue-400 font-medium">
          🕒 {hora}
        </span>
      </div>

      {/* Lateral derecho: fecha y botones */}
      <div className="flex flex-col items-center gap-2">
        {/* Fecha arriba */}
        <span className="text-[11px] text-blue-400 font-medium text-center leading-4 px-2">
          {fechaCompleta}
        </span>

        <div className="flex gap-2">
          <button
            className="w-10 h-10 flex items-center justify-center border-2 border-red-300 bg-red-100 rounded-md
            hover:bg-red-300 hover:border-red-500 transition-all duration-300 hover:scale-110"
            type="button"
            onClick={() => deteleTaks(_id)}
          >
            <img className="w-6" src="./borrar.svg" alt="borrar" />
          </button>

          <button
            className="w-10 h-10 flex items-center justify-center border-2 border-green-300 bg-green-100 rounded-md
            hover:bg-green-300 hover:border-green-500 transition-all duration-300 hover:scale-110"
            type="button"
            onClick={copyTaks}
          >
            <img className="w-6" src="./copy.svg" alt="copiar" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task;
