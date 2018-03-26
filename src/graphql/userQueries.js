import gql from "graphql-tag";

export const currentUser = gql`
  query currentUser {
    currentUser {
      name
      isDisp
      workTypes
    }
  }
`
