import gql from "graphql-tag";

export default gql`
  query deptModels {
    deptModels(
      deptId: "cjbuuvk0v4s3p0162u894mowc"
    ) {
      id
      model {
        id
        article
        name
      }
      prods {
        id
        fullnumber
        hasDefect
        isSpoiled
      }
    }
  }
`
