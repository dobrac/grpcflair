export type DocMethod = {
  name: string;
  description: string;
  requestType: string;
  requestLongType: string;
  requestFullType: string;
  requestStreaming: boolean;
  responseType: string;
  responseLongType: string;
  responseFullType: string;
  responseStreaming: boolean;
};

export type DocService = {
  name: string;
  longName: string;
  fullName: string;
  description: string;
  methods: DocMethod[];
};

export type DocExtension = {
  name: string;
  description: string;
  label: string;
  type: string;
  longType: string;
  fullType: string;
  defaultValue: string;
};

export type DocEnum = {
  name: string;
  longName: string;
  fullName: string;
  description: string;
  values: string[];
};

export type DocField = {
  name: string;
  description: string;
  label: string;
  type: string;
  longType: string;
  fullType: string;
  ismap: boolean;
  isoneof: boolean;
  oneofdecl: string;
  defaultValue: string;
};

export type DocMessage = {
  name: string;
  longName: string;
  fullName: string;
  description: string;
  hasExtensions: boolean;
  hasFields: boolean;
  hasOneofs: boolean;
  extensions: DocExtension[];
  fields: DocField[];
};

export type DocFile = {
  name: string;
  description: string;
  package: string;
  hasEnums: boolean;
  hasExtensions: boolean;
  hasMessages: boolean;
  hasServices: boolean;
  enums: DocEnum[];
  extensions: DocExtension[];
  messages: DocMessage[];
  services: DocService[];
};

export type DocContext = {
  files: DocFile[];
};
