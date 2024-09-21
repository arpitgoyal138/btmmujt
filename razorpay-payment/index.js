/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const Razorpay = require("razorpay");

const test_key = "rzp_test_hZmWKugnd8RY5I";
const test_secret = "fdlMIso6qznujP2Kl2nDVS68";
const live_key = "rzp_live_88NKKwUAVvVNOf";
const live_secret = "63mii6Ocriolj9dUxT2ubD36";
// This razorpayInstance will be used to
// access any resource from razorpay
// const razorpayInstance = new Razorpay({
//   key_id: live_key,
//   key_secret: live_secret,
// });
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
app.get("/hello", (req, res) => {
  res.json("Hello there, from Firebase Functions!");
});

app.post("/createPayment", (req, res) => {
  const { amount, currency, receipt, method = "" } = req.body;
  var razorpayInstance;
  if (method === "TEST") {
    razorpayInstance = new Razorpay({
      key_id: test_key,
      key_secret: test_secret,
    });
  } else {
    razorpayInstance = new Razorpay({
      key_id: live_key,
      key_secret: live_secret,
    });
  }
  razorpayInstance.orders.create(
    { amount, currency, receipt },
    (err, order) => {
      if (!err) {
        const resp = {
          id: order.id,
          amount: order.amount,
          status: "CREATED",
        };
        res.json({ order });
      } else res.send(err);
    }
  );
});

app.post("/createPlan", (req, res) => {
  const { amount, currency, method = "" } = req.body;
  var razorpayInstance;
  if (method === "TEST") {
    razorpayInstance = new Razorpay({
      key_id: test_key,
      key_secret: test_secret,
    });
  } else {
    razorpayInstance = new Razorpay({
      key_id: live_key,
      key_secret: live_secret,
    });
  }
  razorpayInstance.plans.create(
    {
      period: "monthly",
      interval: 1,
      item: {
        name: "Custom Plan - Monthly Donation",
        amount: amount,
        currency: currency,
        description: "Bharatiya Thekdar Mistri Majdur Jankalyan Trust",
      },
      notes: {
        notes_key: "Membership charges - Monthly",
      },
    },
    (err, plan) => {
      if (!err) {
        // Send Plan Data
        res.json(plan);
      } else res.send(err);
    }
  );
});

app.post("/createSubscription", (req, res) => {
  const { amount, planId, method = "" } = req.body;
  let amountToPay = amount;
  var razorpayInstance;
  if (method === "TEST") {
    razorpayInstance = new Razorpay({
      key_id: test_key,
      key_secret: test_secret,
    });
  } else {
    razorpayInstance = new Razorpay({
      key_id: live_key,
      key_secret: live_secret,
    });
  }
  let options = {
    plan_id: planId,
    customer_notify: 1,
    quantity: 1,
    total_count: 60,
  };

  if (amount < 10000) {
    amountToPay = 10000;
    options = {
      ...options,
      addons: [
        {
          item: {
            name: "Setup Charge",
            amount: 10000 - amount,
            currency: "INR",
          },
        },
      ],
    };
  }
  razorpayInstance.subscriptions.create(options, (err, subscription) => {
    if (!err) {
      res.json({ ...subscription, amount: amountToPay / 100 });
    } else res.send(err);
  });
});

app.post("/cancelSubscription", (req, res) => {
  const { subscriptionId, method = "" } = req.body;
  var razorpayInstance;
  if (method === "TEST") {
    razorpayInstance = new Razorpay({
      key_id: test_key,
      key_secret: test_secret,
    });
  } else {
    razorpayInstance = new Razorpay({
      key_id: live_key,
      key_secret: live_secret,
    });
  }

  razorpayInstance.subscriptions.cancel(
    subscriptionId,
    {
      cancel_at_cycle_end: 0,
    },
    (err, subscription) => {
      if (!err) {
        res.json(subscription);
      } else res.send(err);
    }
  );
});

app.post("/pauseSubscription", (req, res) => {
  const { subscriptionId, method = "" } = req.body;
  var razorpayInstance;
  if (method === "TEST") {
    razorpayInstance = new Razorpay({
      key_id: test_key,
      key_secret: test_secret,
    });
  } else {
    razorpayInstance = new Razorpay({
      key_id: live_key,
      key_secret: live_secret,
    });
  }
  razorpayInstance.subscriptions.pause(
    subscriptionId,
    {
      pause_at: "now",
    },
    (err, subscription) => {
      if (!err) {
        res.json(subscription);
      } else res.send(err);
    }
  );
});
app.post("/resumeSubscription", (req, res) => {
  const { subscriptionId, method = "" } = req.body;
  var razorpayInstance;
  if (method === "TEST") {
    razorpayInstance = new Razorpay({
      key_id: test_key,
      key_secret: test_secret,
    });
  } else {
    razorpayInstance = new Razorpay({
      key_id: live_key,
      key_secret: live_secret,
    });
  }
  razorpayInstance.subscriptions.resume(
    subscriptionId,
    {
      resume_at: "now",
    },
    (err, subscription) => {
      if (!err) {
        res.json(subscription);
      } else res.send(err);
    }
  );
});
app.post("/fetchSubscription", (req, res) => {
  const { subscriptionId, method = "" } = req.body;
  var razorpayInstance;
  if (method === "TEST") {
    razorpayInstance = new Razorpay({
      key_id: test_key,
      key_secret: test_secret,
    });
  } else {
    razorpayInstance = new Razorpay({
      key_id: live_key,
      key_secret: live_secret,
    });
  }
  razorpayInstance.subscriptions.fetch(subscriptionId, (err, subscription) => {
    if (!err) {
      res.json(subscription);
    } else res.send(err);
  });
});
// Expose Express API as a single Cloud Function:
exports.razorpayAPI = onRequest(app);
