const allTransactions  = [
  {
    "_id": "69030ce11ce13b382009b296",
    "bookId": "69030cb8bc6a98532ee752d7",
    "userId": "69030cd51ce13b382009b282",
    "issueDate": "2025-10-01T10:00:00.000Z",
    "dueDate": "2025-10-15T10:00:00.000Z",
    "returnDate": "2025-10-14T15:30:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b297",
    "bookId": "69030cb8bc6a98532ee752d8",
    "userId": "69030cd51ce13b382009b282",
    "issueDate": "2025-10-10T12:00:00.000Z",
    "dueDate": "2025-10-24T12:00:00.000Z",
    "returnDate": "2025-10-24T09:00:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b298",
    "bookId": "69030cb8bc6a98532ee752d9",
    "userId": "69030cd51ce13b382009b284",
    "issueDate": "2025-10-20T14:00:00.000Z",
    "dueDate": "2025-11-03T14:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b299",
    "bookId": "69030cb8bc6a98532ee752da",
    "userId": "69030cd51ce13b382009b285",
    "issueDate": "2025-10-05T11:00:00.000Z",
    "dueDate": "2025-10-19T11:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b29a",
    "bookId": "69030cb8bc6a98532ee752db",
    "userId": "69030cd51ce13b382009b286",
    "issueDate": "2025-10-25T16:00:00.000Z",
    "dueDate": "2025-11-08T16:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b29b",
    "bookId": "69030cb8bc6a98532ee752dc",
    "userId": "69030cd51ce13b382009b287",
    "issueDate": "2025-10-18T10:30:00.000Z",
    "dueDate": "2025-11-01T10:30:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b29c",
    "bookId": "69030cb8bc6a98532ee752dd",
    "userId": "69030cd51ce13b382009b288",
    "issueDate": "2025-10-01T09:00:00.000Z",
    "dueDate": "2025-10-15T09:00:00.000Z",
    "returnDate": "2025-10-15T10:00:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b29d",
    "bookId": "69030cb8bc6a98532ee752de",
    "userId": "69030cd51ce13b382009b289",
    "issueDate": "2025-10-12T13:00:00.000Z",
    "dueDate": "2025-10-26T13:00:00.000Z",
    "returnDate": "2025-10-25T11:00:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b29e",
    "bookId": "69030cb8bc6a98532ee752df",
    "userId": "69030cd51ce13b382009b28c",
    "issueDate": "2025-10-05T14:30:00.000Z",
    "dueDate": "2025-10-19T14:30:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b29f",
    "bookId": "69030cb8bc6a98532ee752e0",
    "userId": "69030cd51ce13b382009b28e",
    "issueDate": "2025-10-15T10:00:00.000Z",
    "dueDate": "2025-10-29T10:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2a0",
    "bookId": "69030cb8bc6a98532ee752e1",
    "userId": "69030cd51ce13b382009b282",
    "issueDate": "2025-09-20T11:00:00.000Z",
    "dueDate": "2025-10-04T11:00:00.000Z",
    "returnDate": "2025-10-05T10:00:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b2a1",
    "bookId": "69030cb8bc6a98532ee752e2",
    "userId": "69030cd51ce13b382009b290",
    "issueDate": "2025-10-22T12:00:00.000Z",
    "dueDate": "2025-11-05T12:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2a2",
    "bookId": "69030cb8bc6a98532ee752e3",
    "userId": "69030cd51ce13b382009b292",
    "issueDate": "2025-09-15T15:00:00.000Z",
    "dueDate": "2025-09-29T15:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2a3",
    "bookId": "69030cb8bc6a98532ee752e4",
    "userId": "69030cd51ce13b382009b284",
    "issueDate": "2025-10-01T10:00:00.000Z",
    "dueDate": "2025-10-15T10:00:00.000Z",
    "returnDate": "2025-10-13T10:00:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b2a4",
    "bookId": "69030cb8bc6a98532ee752e5",
    "userId": "69030cd51ce13b382009b282",
    "issueDate": "2025-10-18T14:00:00.000Z",
    "dueDate": "2025-11-01T14:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2a5",
    "bookId": "69030cb8bc6a98532ee752e6",
    "userId": "69030cd51ce13b382009b28d",
    "issueDate": "2025-10-20T16:00:00.000Z",
    "dueDate": "2025-11-03T16:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2a6",
    "bookId": "69030cb8bc6a98532ee752e7",
    "userId": "69030cd51ce13b382009b290",
    "issueDate": "2025-10-05T09:30:00.000Z",
    "dueDate": "2025-10-19T09:30:00.000Z",
    "returnDate": "2025-10-18T10:00:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b2a7",
    "bookId": "69030cb8bc6a98532ee752e8",
    "userId": "69030cd51ce13b382009b288",
    "issueDate": "2025-10-10T11:00:00.000Z",
    "dueDate": "2025-10-24T11:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2a8",
    "bookId": "69030cb8bc6a98532ee752e9",
    "userId": "69030cd51ce13b382009b285",
    "issueDate": "2025-10-01T15:00:00.000Z",
    "dueDate": "2025-10-15T15:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2a9",
    "bookId": "69030cb8bc6a98532ee752ea",
    "userId": "69030cd51ce13b382009b293",
    "issueDate": "2025-10-19T13:00:00.000Z",
    "dueDate": "2025-11-02T13:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2aa",
    "bookId": "69030cb8bc6a98532ee752dc",
    "userId": "69030cd51ce13b382009b295",
    "issueDate": "2025-10-03T10:00:00.000Z",
    "dueDate": "2025-10-17T10:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2ab",
    "bookId": "69030cb8bc6a98532ee752d7",
    "userId": "69030cd51ce13b382009b291",
    "issueDate": "2025-10-15T10:00:00.000Z",
    "dueDate": "2025-10-29T10:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2ac",
    "bookId": "69030cb8bc6a98532ee752e0",
    "userId": "69030cd51ce13b382009b282",
    "issueDate": "2025-10-25T11:00:00.000Z",
    "dueDate": "2025-11-08T11:00:00.000Z",
    "returnDate": null
  },
  {
    "_id": "69030ce11ce13b382009b2ad",
    "bookId": "69030cb8bc6a98532ee752d8",
    "userId": "69030cd51ce13b382009b285",
    "issueDate": "2025-10-10T12:00:00.000Z",
    "dueDate": "2025-10-24T12:00:00.000Z",
    "returnDate": "2025-10-26T14:00:00.000Z"
  },
  {
    "_id": "69030ce11ce13b382009b2ae",
    "bookId": "69030cb8bc6a98532ee752e9",
    "userId": "69030cd51ce13b382009b282",
    "issueDate": "2025-10-05T15:00:00.000Z",
    "dueDate": "2025-10-19T15:00:00.000Z",
    "returnDate": null
  }
];

module.exports = { data: allTransactions };
