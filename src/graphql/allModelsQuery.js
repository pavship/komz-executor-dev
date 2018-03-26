import gql from "graphql-tag";

export default gql`
  query allModelsQuery {
    allModels {
      id
      article
      name
    }
  }
`
