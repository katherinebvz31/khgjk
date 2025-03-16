// components/MiComponente.jsx
export default function MiComponente() {
  return (
    <div className="p-4">
      {/* Input: texto negro, con borde y placeholder en gris */}
      <input
        type="text"
        placeholder="Escribe aquí..."
        className="border p-2 text-black placeholder-gray-500"
      />

      {/* Tabla de ejemplo */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-white">
            <th className="p-2 border text-[#08422a] font-bold">Encabezado 1</th>
            <th className="p-2 border text-[#08422a] font-bold">Encabezado 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border text-black">Dato 1</td>
            <td className="p-2 border text-black">
              Este es un{" "}
              <span className="text-[#08422a] font-semibold">dato clave</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
