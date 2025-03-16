import XLSX from "xlsx";

export default function handler(req, res) {
  // Aquí se obtienen los registros diarios. 
  // Puedes reemplazar este arreglo con los datos reales (por ejemplo, consultándolos desde una base de datos).
  const registros = [
    { fecha: "2025-03-16 10:00:00", codigo: "123", nombre: "Producto A", unidad: "pz", cantidad: 10 },
    { fecha: "2025-03-16 11:30:00", codigo: "456", nombre: "Producto B", unidad: "kg", cantidad: 5 },
    // ... otros registros del día
  ];

  // Convertir los registros a una hoja de Excel
  const worksheet = XLSX.utils.json_to_sheet(registros);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registro Diario");

  // Escribir el workbook a un buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  // Configurar headers para la descarga
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", "attachment; filename=registro_diario.xlsx");
  res.status(200).send(buffer);
}
