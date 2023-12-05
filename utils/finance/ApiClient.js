class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  createUrl(path, params) {
    let url = new URL(`${this.baseUrl}/${path}`);
    url.searchParams.append("apikey", this.apiKey);
    for (let key in params) {
      url.searchParams.append(key, params[key]);
    }
    console.log(url.toString());
    return url;
  }

  async get(path, params) {
    let url = this.createUrl(path, params);
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }

  async getQuotePrice(code) {

    try {
      const data = await this.get("query",
        {
          symbol: code,
          function: "TIME_SERIES_DAILY",
          interval: "60min",
        }
      );
      
        
      const todayPriceData = Object.keys(data["Time Series (Daily)"])[0];
      const todayPrice = data["Time Series (Daily)"][todayPriceData]["4. close"];
  
      return todayPrice;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = ApiClient;