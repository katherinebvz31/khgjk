import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { format } from "date-fns";

const Home = () => {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [productos, setProductos] = useState({});
  const [salidas, setSalidas] = useState([]);

  const getTodayKey = () => {
    return new Date().toISOString().slice(0, 10);
  };

  useEffect(() => {
    const todayKey = getTodayKey();
    const storedData = localStorage.getItem(`salidas-${todayKey}`);
    if (storedData) {
      setSalidas(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const todayKey = getTodayKey();
    localStorage.setItem(`salidas-${todayKey}`, JSON.stringify(salidas));
  }, [salidas]);

  useEffect(() => {
    fetch("/productos.xlsx")
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const productosMap = {};
        jsonData.forEach((producto) => {
          productosMap[producto.CÓDIGO] = producto;
        });
        setProductos(productosMap);
      });
  }, []);

  const agregarSalida = () => {
    if (!productos[codigo] || !cantidad) {
      console.warn("⚠️ Código no encontrado en la base de datos o cantidad vacía");
      return;
    }
    const nuevoRegistro = {
      id: Date.now(),
      fecha: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      codigo,
      nombre: productos[codigo].PRODUCTO,
      unidad: productos[codigo].UNIDAD,
      cantidad,
    };
    setSalidas([nuevoRegistro, ...salidas]);
    setCodigo("");
    setCantidad("");
  };

  const eliminarSalida = (id) => {
    const nuevasSalidas = salidas.filter((salida) => salida.id !== id);
    setSalidas(nuevasSalidas);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salidas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registro Diario");
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registro_diario.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed p-4 overflow-y-auto"
      style={{ backgroundImage: "url('/fondo.jpg')" }}
    >
      <div className="max-w-4xl mx-auto mt-[200px] relative">
        {/* Botón para descargar Excel */}
        <button
          onClick={downloadExcel}
          className="absolute top-4 right-4 bg-black p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <h1 className="text-center text-3xl font-bold text-white">
          Registro de Salidas
        </h1>

        {/* Fila de inputs y botón */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <input
            type="number"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-20 p-2 border rounded text-black shadow-sm"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-20 p-2 border rounded text-black shadow-sm"
          />
          <button
            onClick={agregarSalida}
            className="bg-black text-white px-6 py-2 rounded active:bg-white active:text-black hover:bg-white hover:text-black transition-colors duration-300 shadow-sm"
          >
            Agregar
          </button>
        </div>

        {/* Tabla de registros con imagen y botón de eliminación */}
        <div className="mt-8">
          <table className="w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-[#08422a] text-white">
              <tr>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Código</th>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Unidad</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Imagen</th>
              </tr>
            </thead>
            <tbody>
              {salidas.map((salida) => (
                <tr key={salida.id} className="text-black">
                  <td className="p-2 border">{salida.fecha}</td>
                  <td className="p-2 border">{salida.codigo}</td>
                  <td className="p-2 border">{salida.nombre}</td>
                  <td className="p-2 border">{salida.unidad}</td>
                  <td className="p-2 border flex items-center justify-between">
                    {salida.cantidad}
                    {/* ❌ Botón de eliminar SIEMPRE visible */}
                    <button
                      onClick={() => eliminarSalida(salida.id)}
                      className="ml-3 text-red-500 text-sm hover:text-red-700 transition"
                      title="Eliminar"
                    >
                      ❌
                    </button>
                  </td>
                  <td className="p-2 border flex items-center justify-center">
                    {productos[salida.codigo] ? (
                      <Image
                        src={`/imagenes/${salida.codigo}.jpg`}
                        width={100}
                        height={100}
                        alt="Producto"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
