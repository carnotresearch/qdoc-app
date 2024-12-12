import React from "react";

function Features() {
  const features = [
    {
      top: "Secure",
      header: "On-premise Knowledge Agent",
      body: "Deployable as containerised, secure and completely on-site solution for corporate data",
    },
    {
      top: "Multilingual",
      header: "Supports Indian Languages",
      body: "Enables seamless interaction with knowledge repository in over 20+ Indian languages",
    },
    {
      top: "Ingestion",
      header: "Unstructured Data",
      body: "Ingest structured and unstructured data from various sources (excel, csv, word, pdf, text)",
    },
  ];
  return (
    <div className="container mt-4">
      <div className="row mt-2">
        {features.map((feature, index) => (
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
            <div className="card">
              <div className="card-header">{feature.top}</div>
              <div className="card-body">
                <h5 className="card-title">
                  <b>{feature.header}</b>
                </h5>
                <p className="card-text">{feature.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
