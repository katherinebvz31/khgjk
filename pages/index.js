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
    setSalidas([...salidas, nuevoRegistro]);
    setCodigo("");
    setCantidad("");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed p-4"
      style={{ backgroundImage: "url('/fondo.jpg')" }}
    >
      {/* Contenedor interno con margen superior para fijar la posición original */}
      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="text-center text-3xl font-bold text-white">Registro de Salidas</h1>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="p-2 border rounded mr-2 text-black"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="p-2 border rounded text-black"
          />
          <button
            onClick={agregarSalida}
            className="ml-2 bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors duration-300"
          >
            Agregar
          </button>
        </div>
        {/* Al digitar el código, si se encuentra el producto, aparece la imagen y se desplaza el contenido hacia abajo */}
        {productos[codigo] && (
          <div className="mt-4 bg-white p-4 rounded shadow flex flex-col items-center">
            <h2 className="text-xl font-bold">{productos[codigo].PRODUCTO}</h2>
            <p>Unidad: {productos[codigo].UNIDAD}</p>
            <div className="flex justify-center w-full">
              <Image src={`/imagenes/${codigo}.jpg`} width={100} height={100} alt="Producto" />
            </div>
          </div>
        )}
        <table className="mt-4 w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2 border text-[#08422a] font-bold">Fecha</th>
              <th className="p-2 border text-[#08422a] font-bold">Código</th>
              <th className="p-2 border text-[#08422a] font-bold">Nombre</th>
              <th className="p-2 border text-[#08422a] font-bold">Unidad</th>
              <th className="p-2 border text-[#08422a] font-bold">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {salidas.map((salida, index) => (
              <tr key={index}>
                <td className="p-2 border text-black">{salida.fecha}</td>
                <td className="p-2 border text-black">{salida.codigo}</td>
                <td className="p-2 border text-black">{salida.nombre}</td>
                <td className="p-2 border text-black">{salida.unidad}</td>
                <td className="p-2 border text-black">{salida.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
