import axios from "axios";

const HeaderSeller = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "VtexIdclientAutCookie": "eyJhbGciOiJFUzI1NiIsImtpZCI6IkRFMDNGNjAxNDZEN0RDRjEyQjMyOEI0QzgzOUI0RTVBODEwQUUwOUMiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJqYmVycm9jYWxAcmFzaHBlcnUuY29tIiwiYWNjb3VudCI6InFhc3RvcmVmcm9udDg0MCIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiNGI1NTQzMTEtNzBiNC00MzA0LTk0MjQtY2QzYjAwNzA1NTkyIiwiZXhwIjoxNjk1ODQ5ODQ5LCJ1c2VySWQiOiJmNWViOWU2OC01OTQxLTQ2NzUtOTliYS03ZDgwNTZjYTE1MmYiLCJpYXQiOjE2OTU3NjM0NDksImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiIzNmNlODZkZC1hYjcyLTQ1MGEtOGRlYS03NmNlNmZjZDkwYWUifQ.d-p35t9c-con3woC21XsbP4KfR-lT-9UR9JitBeXYceEJ-2sADPGJx0nwHB86YmGDk8A8cACh4udScLScTEmiQ"
}
export const utilsDatos = async (datos, categoryId) => {

    for (const element of datos) {
        // INICIO MARCA
        let sellerBrand = element.brandId
        let elementBrandsId = ''

        const brands = await axios.get(`https://${element.origin}.myvtex.com/api/catalog-seller-portal/brands`, { headers: HeaderSeller })
        const arrayBrands = await brands.data.data

        for (const elementSell of arrayBrands) {
            if (elementSell.name == sellerBrand) {

                elementBrandsId = elementSell.id
            }
        }
        if (elementBrandsId == '') {
            const createSellerProducto = await axios.post(`https://${element.origin}.myvtex.com/api/catalog-seller-portal/brands`,
                {
                    "name": sellerBrand,
                    "isActive": true
                },
                { headers: HeaderSeller })
            elementBrandsId = createSellerProducto.data.id
        }
        // - FIN MARCA -

        // INICIO SLUG
        let slugName = element.name
        slugName = slugName.replaceAll('$', 'dollar'),
            slugName = slugName.replaceAll('ñ', 'n')
        slugName = slugName.replace(/[^a-zA-Z0-9 ]/g, '')
        slugName = slugName.toLowerCase()
        slugName = slugName.replaceAll(' ', '-')
        slugName = '/' + slugName

        // -- Recorrer la cantidad de imagnes por producto

        let imgCantLogic = []
        let imgCantLogicId = []

        for (let i = 0; i < element.imgcant; i++) {
            imgCantLogic.push(
                {
                    "id": `${element.origin}-${element.externalId}_${i+1}.jpg`,
                    "url": `https://${element.origin}.vtexassets.com/assets/vtex.catalog-images/products/${element.origin}-${element.externalId}_${i+1}.jpg`,
                    "alt": `${element.name} ${i+1}`
                }
            )
            imgCantLogicId.push(`${element.origin}-${element.externalId}_${i+1}.jpg`)
        }

        // -- Fin --

        // - FIN SLUG -
        const productoSeller = {
            "status": "active",
            "name": element.name,
            "brandId": elementBrandsId.toString(),
            "categoryIds": [
                categoryId
            ],
            "slug": slugName,
            "images": imgCantLogic,
            "skus": [
                {
                    "name": element.name,
                    "externalId": element.externalId.toString(),
                    "isActive": true,
                    "weight": element.weight,
                    "dimensions": {
                        "width": element.width,
                        "height": element.height,
                        "length": element.length
                    },
                    "images": imgCantLogicId
                }
            ],
            "origin": element.origin
        }

        console.log(productoSeller);

        const urlSeller = `https://${element.origin}.myvtex.com/api/catalog-seller-portal/products`

        // ######## Crear Productos ########
        const urlSellerMkp = await axios.post(urlSeller, productoSeller, { headers: HeaderSeller })

        // Descipción
        const urlSellerMkpId = urlSellerMkp.data.id
        console.log(urlSellerMkpId);

        const createProductDescription = await axios.put(`https://${element.origin}.myvtex.com/api/catalog-seller-portal/products/${urlSellerMkpId}/description`,
            {
                "productId": urlSellerMkpId,
                "description": element.description
            }, { headers: HeaderSeller })

        console.log('creado', createProductDescription); 
        // - Fin Descipción

    };
}


