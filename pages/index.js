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
      fecha: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      codigo,
      nombre: productos[codigo].PRODUCTO,
      unidad: productos[codigo].UNIDAD,
      cantidad,
    };
    // Agregamos el nuevo registro al inicio para que los más recientes aparezcan primero
    setSalidas([nuevoRegistro, ...salidas]);
    setCodigo("");
    setCantidad("");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed p-4 overflow-y-auto"
      style={{ backgroundImage: "url('/fondo.jpg')" }}
    >
      <div className="max-w-4xl mx-auto mt-[200px]">
        <h1 className="text-center text-3xl font-bold text-white">
          Registro de Salidas
        </h1>

        {/* Fila de inputs y botón (sin casillero de imagen) */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <input
            type="number"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="p-2 border rounded text-black shadow-sm"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="p-2 border rounded text-black shadow-sm"
          />
          <button
            onClick={agregarSalida}
            className="bg-black text-white px-6 py-2 rounded active:bg-white active:text-black hover:bg-white hover:text-black transition-colors duration-300 shadow-sm"
          >
            Agregar
          </button>
        </div>

        {/* Vista previa del producto con nombre, unidad e imagen */}
        {productos[codigo] && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                {productos[codigo].PRODUCTO}
              </h2>
              <p className="text-white">Unidad: {productos[codigo].UNIDAD}</p>
            </div>
            <div className="w-[100px] h-[100px] border border-gray-300 rounded shadow-sm bg-white">
              <div className="relative w-[100px] h-[100px]">
                <Image
                  src={`/imagenes/${codigo}.jpg`}
                  layout="fill"
                  objectFit="contain"
                  alt="Producto"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tabla de registros con columna de imagen */}
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
              {salidas.map((salida, index) => (
                <tr key={index} className="text-black">
                  <td className="p-2 border">{salida.fecha}</td>
                  <td className="p-2 border">{salida.codigo}</td>
                  <td className="p-2 border">{salida.nombre}</td>
                  <td className="p-2 border">{salida.unidad}</td>
                  <td className="p-2 border">{salida.cantidad}</td>
                  <td className="p-2 border flex items-center justify-center">
                    {productos[salida.codigo] ? (
                      <div className="w-[100px] h-[100px] border border-gray-300 rounded shadow-sm bg-white">
                        <div className="relative w-[100px] h-[100px]">
                          <Image
                            src={`/imagenes/${salida.codigo}.jpg`}
                            layout="fill"
                            objectFit="contain"
                            alt="Producto"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        Sin imagen
                      </span>
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
