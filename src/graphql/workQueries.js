import gql from "graphql-tag";

export const createWork = gql`
  mutation createWork ( $start: String! $execName: String! $workType: String! $workSubType: String $models: String) {
    createWork ( start: $start execName: $execName workType: $workType workSubType: $workSubType models: $models) {
      id
      execName
      start
      fin
      time
      workType
      workSubType
      models {
        id
        name
        article
        prods {
          id
          fullnumber
        }
      }
    }
  }
`
export const finishWork = gql`
  mutation finishWork ( $id: ID!, $time: Int!, $fin: String! ) {
    finishWork ( id: $id, time: $time, fin: $fin ) {
      id
      execName
      start
      fin
      time
      workType
      workSubType
      models {
        id
        name
        article
        prods {
          id
          fullnumber
        }
      }
    }
  }
`
export const curWork = gql`
  query curWork {
    curWork {
      id
      start
      fin
      time
      workType
      workSubType
      noRecent
      models {
        id
        name
        article
        prods {
          id
          fullnumber
        }
      }
    }
  }
`
