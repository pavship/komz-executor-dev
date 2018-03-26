import gql from "graphql-tag";

export default gql`
  query deptModels {
    deptModels(
      deptId: "cjbuuvddo4opm0147d178zmuy"
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
