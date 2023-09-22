interface AmazonListing {
    asin : string,   
    productImgUrl : string,
    rating : string,
    price : string, 
}

interface DisplayContentProps {
  AmazonProductListings : Array<AmazonListing>
}

export function DisplayContent(props: DisplayContentProps): React.JSX.Element {
  return <h1>DisplayContent</h1>
}