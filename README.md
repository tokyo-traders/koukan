<br/>
<p align="center">
  <a href="https://github.com/tokyo-traders/koukan">
    <img src="https://user-images.githubusercontent.com/67497636/217703956-9a1c7261-930a-4fd4-a536-388541d7ed85.png" alt="Logo" width="480" height="250">
  </a>

  <p align="center">
    The non monetary e-commerce
    <br/>
    <br/>
    <a href="https://github.com/tokyo-traders/koukan"><strong>Explore the docs »</strong></a>
    <br/>
    <br/>
    <a href="#">Go to deployed version</a>
    .
<!--     <a href="https://github.com/ShaanCoding/ReadME-Generator/issues">Report Bug</a>
    .
    <a href="https://github.com/ShaanCoding/ReadME-Generator/issues">Request Feature</a> -->
  </p>
</p>

<!-- ![Downloads](https://img.shields.io/github/downloads/ShaanCoding/ReadME-Generator/total) ![Contributors](https://img.shields.io/github/contributors/ShaanCoding/ReadME-Generator?color=dark-green) ![Issues](https://img.shields.io/github/issues/ShaanCoding/ReadME-Generator) ![License](https://img.shields.io/github/license/ShaanCoding/ReadME-Generator)  -->

## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
<!-- * [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license) -->
* [Authors](#authors)
<!-- * [Acknowledgements](#acknowledgements) -->

## About The Project

![Screen Shot](images/screenshot.png)

This application lets you swap things you do not need anymore with other users, allowing you to save money and at the same time lessen the amount of waste.
<br/>
Here's why:

* Getting rid of things you do not need can take time, efforts and sometimes also money, so better to have something back!
* The more you waste and produce, the higher is your footprint. Remember, we only have one World!
* Save the World and saving money, still need more? :bird: :bird: :rock:


## Built With

The backend of this application has been built using Django Rest Framework and PostgrsQL as database. Frontend is built with Javascript using ReactJS library, styled with Material UI.
</br>



<table>
  <tr>
    <th>Languages</th>
    <th>Libraries</th>
    <th>Framework</th>
    <th>Database</th>
  </tr>
  <tr>
  <td>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a>
  </td>
  <td>
    <a href="https://https://mui.com//" target="_blank" rel="noreferrer"> 
      <img src="https://user-images.githubusercontent.com/67497636/217686777-1302937e-51e8-4d8b-8905-8796c4911b88.png" alt="react" width="40" height="40"/> </a>
  </td>
  <td>
      <a href="https://www.djangoproject.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/django.svg" alt="django" width="40" height="40"/> </a>
  </td>
  <td>
      <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a>
  </td>
  </tr>
  <tr>
    <td>
    <a href="https://www.python.org" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> </a>
    </td>
    <td>
      <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
    </td>
  </tr>
<table>

## Getting Started

If you ae a developers and want to use our application follow the steps below

### Prerequisites

Make sure that you have downloaded [Python](https://www.python.org/downloads/) and [Django](https://docs.djangoproject.com/en/4.1/howto/windows/) is installed


### Installation

1. clone the app by running 
  ```sh 
  git clone https://github.com/tokyo-traders/koukan
  ```
2. install all the packages
```sh
npm install npm@latest -g
```
3. navigate to backend/api/backend and create a .env file. Add the following to the file
```sh
SECRET_KEY=[your DRF secret key] *
DB_NAME=[your database name]
DB_USER=postgres [only Windows]
DB_PASSWORD=[your database password]
DB_PORT=5432
DB_HOST=127.0.0.1
```
_*you can generate your SECRET_KEY from the Django Shell_
  ```
  >>> django-admin shell
  >>> get_random_secret_key()
  ```
  _(or just go to https://djecrety.ir/)_
  
## Usage

  In the homepage you will see all the listings (items to be traded) from other users. You can click on the each card to get more details. You can place an offer to the item but first make sure that you have already uploaded the item into your inventory.

  If you want to accept any offer you received, just go to the listing and accept the offer. Then make sure that you confirm teh  transaction is concluded so you can load the item you received to your inventory, and give a score to the other user.

<!-- ## Roadmap

See the [open issues](https://github.com/ShaanCoding/ReadME-Generator/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/ShaanCoding/ReadME-Generator/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.
* Please also read through the [Code Of Conduct](https://github.com/ShaanCoding/ReadME-Generator/blob/main/CODE_OF_CONDUCT.md) before posting your first idea as well.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/ShaanCoding/ReadME-Generator/blob/main/LICENSE.md) for more information. -->

## Authors

* [Flavio Ripa](https://github.com/rpiflv)
* [Adam](#)
* [Koji](#)
* [Evon](#)
