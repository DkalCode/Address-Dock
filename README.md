
<h1 id="readme-top" align="center">
  <br>
  <a href="https://github.com/DkalCode/Address-Dock"><img src="https://i.ibb.co/PZWzNWZ0/3a11d91555b7e6c4b62dc2c2d9a2b4dd.png" alt="Forgination" width="200"></a>
  <br>
  Forgination - Address API
  <br>
</h1>

<h5 align="center">A simple REST API for addresses within New York State</h5>
  <p align="center">
<a href="https://api.forgination.com">View Demo</a>
    &middot;
    <a href="https://docs.forgination.com">Explore the docs</a>
  </p>

<p align="center">
 <img alt="NPM Version" src="https://img.shields.io/npm/v/express?label=express">
 <img alt="NPM Version" src="https://img.shields.io/npm/v/typescript?label=typescript">
 <img alt="NPM Version" src="https://img.shields.io/npm/v/dotenv?label=dotenv&color=%238FAB44">
</p>

<!-- TABLE OF CONTENTS -->

<p align="center">
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#installation">Installation</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#authors">Authors</a> •
  <a href="#acknowledgments">Acknowledgments</a> •
  <a href="#license">License</a>
</p>
<br/>

<h3 id="prerequisites">Prerequisites</h3>

This project requires:
* Node v20.13.1
  ```sh
  nvm install v20.13.1
  ```
  
  ```sh
  nvm use v20.13.1
  ```
 
<h3 id="installation">Installation</h3>

1. Clone the repo
   ```sh
   git clone https://github.com/DkalCode/Address-Dock.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create .env file with the following
   ```
   SERVER_PORT=8080
   ENV="dev"
   ```
4. Run the project with
   ```
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- API REFERENCE -->

<h3 id="api-reference">API Reference</h3>

> [!NOTE]  
> This reference is a work in progress.

#### Get number of addresses returned given a query

```http
  POST /address/count
```

| Body      | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `See Body Reference` | `json` |  Either Zip Code or City Name  |

#### Get details on an address

```http
  POST /address/request
```

| Body      | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `See Body Reference` | `json` |  Either Zip Code or City Name  |

#### Body Reference

**Query by City:**
```json
{
  "city": "Victor"
}
```

**Query by Zip Code:**
```json
{
  "zipcode": "14586"
}
```

<!-- AUTHORS -->

<h3 id="authors">Authors</h3>

* David: [DkalCode](https://github.com/DkalCode)
* Kieran: [Ksullivan87](https://github.com/Ksullivan87)
* Kyle: [Kweishaar9](https://github.com/Kweishaar9)
* Will: [OlympusCoding](https://github.com/OlympusCoding)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

<h3 id="acknowledgments">Acknowledgments</h3>

* Template Author: [rocnick](https://github.com/rocnick)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

<h3 id="license">License</h3>

MIT License

Copyright (c) 2025 Forgination

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



