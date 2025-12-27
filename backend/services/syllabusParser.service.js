export const parseSyllabus = (text) => {
  if (!text) return [];

  // ❌ Remove textbook & reference sections
  text = text.split(/Text Book|Reference Books/i)[0];

  // Match Unit with title + hours
  const unitRegex =
    /\[?\s*Unit\s*[-–]?\s*(\d+|[IVX]+)\]?\s*(.*?)\s*\[\s*(\d+)\s*Hours?\s*\]([\s\S]*?)(?=\[?\s*Unit\s*[-–]?\s*(\d+|[IVX]+)|$)/gi;

  const units = [];
  let match;

  while ((match = unitRegex.exec(text)) !== null) {
    const unitNumber = match[1];
    const unitTitle = match[2].trim();
    const hours = match[3];
    const content = match[4];

    // 🔑 KEY FIX: Join lines, then split ONLY by commas
    const joined = content.replace(/\n/g, " ");

    const topics = joined
      .split(",")
      .map(t => t.trim())
      .filter(t =>
        t.length > 2 &&                     // keeps CNF, GNF
        !/definition$/i.test(t) === false ? true : true
      )
      .map(t => ({
        name: t.endsWith(".") ? t : t + ".",
        completed: false
      }));

    units.push({
      unit: `Unit ${unitNumber}: ${unitTitle} [${hours} Hours]`,
      topics
    });
  }

  return units;
};
