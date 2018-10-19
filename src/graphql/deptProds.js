import gql from "graphql-tag";

export default gql`
  query DeptProds {
    deptProds(
      deptId: "cjbuuvk0v4s3p0162u894mowc"
    ) {
      id
      fullnumber
      hasDefect
      isSpoiled
      model {
        id
        article
        name
      }
    }
  }
`
