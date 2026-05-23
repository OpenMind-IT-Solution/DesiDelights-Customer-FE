export default function AboutPage() {
  return (
    <section className="py-10 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
        <div className="max-w-5xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            About DesiDelight
          </h1>

          <p className="text-gray-600 leading-8 mb-6">
            Welcome to <span className="font-semibold">DesiDelight</span>, an
            authentic Indian restaurant located in Belgium where we bring the
            vibrant flavors of India to your table. Our mission is to share the
            rich traditions of Indian cuisine with the local community through
            delicious food, warm hospitality, and unforgettable dining
            experiences.
          </p>

          <p className="text-gray-600 leading-8 mb-6">
            At DesiDelight, we use traditional spices, fresh ingredients, and
            authentic cooking techniques to prepare every dish. From aromatic
            biryanis and flavorful curries to sizzling grilled dishes and street
            food favorites, our menu offers something special for every food
            lover.
          </p>

          <p className="text-gray-600 leading-8 mb-6">
            Whether you are enjoying a quick meal, dining with family, or
            celebrating a special occasion, our restaurant provides a warm and
            welcoming atmosphere that reflects the true spirit of Indian
            hospitality.
          </p>

          <p className="text-gray-600 leading-8">
            Our goal is simple — to deliver the authentic taste of India while
            providing excellent service and high-quality food to our guests in
            Belgium.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Authentic Indian Taste</h3>
            <p className="text-gray-600">
              Our chefs use traditional Indian spices and recipes to create
              flavorful dishes that capture the true taste of India.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Fresh Ingredients</h3>
            <p className="text-gray-600">
              We carefully select high-quality ingredients to ensure every meal is
              fresh, delicious, and satisfying.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">
              Great Dining Experience
            </h3>
            <p className="text-gray-600">
              Enjoy a warm and welcoming atmosphere perfect for family dinners,
              friends, and special occasions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
