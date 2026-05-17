export const getCleanImageUrl = (imagePath?: string) => {
  if (!imagePath) return "/images/placeholder.png";

  if (imagePath.startsWith("http")) {
    const decoded = decodeURIComponent(imagePath);
    // Matches and extracts both type and raw filename, removing brackets and quotes
    // e.g. http://localhost:3009/api/images/menu-items/["paneer_tikka.png"]
    // -> type: menu-items, filename: paneer_tikka.png
    const matches = decoded.match(/\/api\/images\/([^/]+)\/\[?"?([^"\]]+)"?\]?/);
    if (matches && matches[2]) {
      const type = matches[1];
      const filename = matches[2];
      const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:3009/upload/images";
      return `${baseUrl}/${filename}`;
    }
    return imagePath;
  }

  return imagePath;
};
