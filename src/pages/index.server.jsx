import {
  useShopQuery,
  flattenConnection,
  ProductProviderFragment,
  Image,
  Link,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/layouts/Layout.server';
import Hero2 from '../../components/Hero/Hero2/Hero2';
import FeaturedCollection from '../components/FeaturedCollection';
import ProductCard from '../components/ProductCard';
import Welcome from '../components/Welcome.server';
import {Suspense} from 'react';


export default function Index({country = {isoCode: 'US'}}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
    },
  });
 


const collections = data ? flattenConnection(data.collections) : [];
const Hero2Collections = collections.filter((item) => item.handle == 'men' || item.handle == 'women');
const featuredProductsCollection = collections[0];
const featuredProducts = featuredProductsCollection
? flattenConnection(featuredProductsCollection.products)
: null;


return (
  <Layout>
    <Hero2 collectionsData={Hero2Collections} />

    <div className="relative mb-12">
      <Welcome />
      <Suspense fallback={<BoxFallback />}>
        <FeaturedProductsBox country={country} />
      </Suspense>
      <Suspense fallback={<BoxFallback />}>
        <FeaturedCollectionBox country={country} />
      </Suspense>
    </div>
  </Layout>
);
}

function BoxFallback() {
  return <div className="bg-white p-12 shadow-xl rounded-xl mb-10 h-40"></div>;
}

function FeaturedProductsBox({country}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
    },
  });
  
  const collections = data ? flattenConnection(data.collections) : [];
  const Hero2Collections = collections.filter((item) => item.handle == 'men' || item.handle == 'women');
  const featuredProductsCollection = collections[0];
  const featuredProducts = featuredProductsCollection
  ? flattenConnection(featuredProductsCollection.products)
  : null;
  
  
  return (
    <div className="bg-white p-12 shadow-xl rounded-xl mb-10">
      {featuredProductsCollection ? (
        <>
          <div className="flex justify-between items-center mb-8 text-md font-medium">
            <span className="text-black uppercase">
              {featuredProductsCollection.title}
            </span>
            <span className="hidden md:inline-flex">
              <Link
                to={`/collections/${featuredProductsCollection.handle}`}
                className="text-blue-600 hover:underline"
              >
                Shop all
              </Link>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="md:hidden text-center">
            <Link
              to={`/collections/${featuredProductsCollection.handle}`}
              className="text-blue-600"
            >
              Shop all
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function FeaturedCollectionBox({country}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
    },
  });

  const collections = data ? flattenConnection(data.collections) : [];
  const featuredCollection =
    collections && collections.length > 1 ? collections[1] : collections[0];

  return <FeaturedCollection collection={featuredCollection} />;
}

const QUERY = gql`
  query indexContent(
    $country: CountryCode
    $numCollections: Int = 25
    $numProducts: Int = 3
    $includeReferenceMetafieldDetails: Boolean = false
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 1
    $numProductVariantMetafields: Int = 10
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    collections(first: $numCollections) {
      edges {
        node {
          descriptionHtml
          description
          handle
          id
          title
          image {
            ...ImageFragment
          }
          products(first: $numProducts) {
            edges {
              node {
                ...ProductProviderFragment
              }
            }
          }
        }
      }
    }
  }

  ${ProductProviderFragment}
  ${Image.Fragment}
`;
