async function convertToJson(res) {
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    console.error("Server error:", data);
    throw new Error(JSON.stringify(data));
  }
}

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ExternalServices {
  constructor(category) {
    this.category = category;

    if (category) {
      this.path = new URL(
        `../json/${this.category}.json`,
        import.meta.url
      );
    }
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();

    return products.find((item) => item.Id === id);
  }

  async checkout(payload) {
    const url = `${baseURL}checkout`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    return fetch(url, options).then(convertToJson);
  }
}