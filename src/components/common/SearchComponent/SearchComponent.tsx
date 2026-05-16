"use client";

const SearchComponent = () => {
  const Searchable = (value: string) => {
    console.log("Search value:", value);
  };
  return (
    <input
      className="rounded-full bg-gray-100 py-2 px-4 fs-7 outline-none focus:border focus:border-[var(--primary-color)]"
      name="search"
      placeholder="Search..."
      onChange={(e) => Searchable(e.target.value)}
    />
  );
};

export default SearchComponent;
