// import Header1 from '../Header/Header1/Header1'
// import Header2 from '../Header/Header2/Header2'
// import Header3 from '../Header/Header3/Header3'

// export default function MainLayout(props){
//   return(<div className="fixed-nav transparent-nav">
//     <Header3 />
//     <main >{props.children}</main>
//     <footer>This is the Footer</footer>
//   </div>)
// }



import {
  Image,
  useShopQuery,
  flattenConnection,
  LocalizationProvider,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Header from '../../src/components/Header.client';
import Footer from '../../src/components/Footer.server';
import Cart from '../../src/components/Cart.client';
import {Suspense} from 'react';

import Collection1 from '../../components/Collections/Collection1/Collection1.jsx';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export default function Layout({children, hero}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      numCollections: 3,
    },
    cache: {
      maxAge: 60,
      staleWhileRevalidate: 60 * 10,
    },
  });
  const collections = data ? flattenConnection(data.collections) : null;
  const products = data ? flattenConnection(data.products) : null;
  const storeName = data ? data.shop.name : '';

  return (
    <LocalizationProvider>

    <div className="fixed-nav transparent-nav">
      <div className="min-h-screen max-w-screen text-gray-700 font-sans">
        {/* TODO: Find out why Suspense needs to be here to prevent hydration errors. */}
        <Suspense fallback={null}>
          <Header collections={collections} storeName={storeName} />
          <Cart />
        </Suspense>
        <main >
          {hero}
          <div className="mx-auto max-w-7xl p-4 md:py-5 md:px-8">
            {children}
          </div>
        </main>
        <Collection1 />
        <Footer collection={collections[0]} product={products[0]} />
      </div>
    </div>
    </LocalizationProvider>
  );
}

const QUERY = gql`
  query indexContent($numCollections: Int!) {
    shop {
      name
    }
    collections(first: $numCollections) {
      edges {
        node {
          description
          handle
          id
          title
          image {
            ...ImageFragment
          }
        }
      }
    }
    products(first: 1) {
      edges {
        node {
          handle
        }
      }
    }
  }
  ${Image.Fragment}
`;
