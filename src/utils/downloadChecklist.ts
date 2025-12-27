export const downloadChecklistPDF = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/syllabus/checklist", {
    method: "POST",
    body: formData
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "syllabus-checklist.pdf";
  a.click();

  window.URL.revokeObjectURL(url);
};
