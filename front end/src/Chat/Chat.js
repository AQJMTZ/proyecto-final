import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Button from "@mui/material/Button";
import { Container, TextField, Typography } from "@mui/material";
import crypto from "crypto";
import bigInt from "big-integer";

const aValue = 17123207;
const qValue = 2426697107;

const Chat = ({
  socket,
  xValue,
  yValue,
  startingConversation,
  cryptoKey,
  handleKeyChange,
}) => {
  const [chat, setChat] = useState({
    messages: {},
    ultimoMSSG: "",
    MSSG: "",
    MSSGSend: "",
    otherYValue: 0,
    // cryptoKey: 0,
  });
  console.log(cryptoKey);

  useEffect(() => {
    if (cryptoKey != "") {
      socket.on("Mensaje ASCP", (response) => {
        if (response.function === 1) {
          const message = decodeDesECB(response.data, cryptoKey);
          console.log(message);
          if (message !== chat.ultimoMSSG) {
            setChat({ ...chat, ultimoMSSG: message });
          }
        }
      });
    }
  }, [cryptoKey]);

  useEffect(() => {
    if (socket !== undefined) {
      console.log(socket);
      if (startingConversation) {
        socket.emit("Mensaje ASCP", {
          function: 2,
          q: 2426697107,
          a: 17123207,
          y: yValue,
        });
      } else {
        socket.emit("Mensaje ASCP", {
          function: 3,
          q: 2426697107,
          a: 17123207,
          y: yValue,
        });
      }
      socket.on("Mensaje ASCP", (response) => {
        switch (response.function) {
          case 2:
            if (!startingConversation) {
              const tempKey = calculateKey(response.y);
              handleKeyChange(tempKey.toString().substring(0, 8));
            }
            break;
          case 3:
            if (startingConversation) {
              const tempKey = calculateKey("111111111111111111111111");
              handleKeyChange(tempKey.toString().substring(0, 8));
              socket.emit("Mensaje ASCP", {
                function: 2,
                q: 2426697107,
                a: 17123207,
                y: yValue,
              });
            }
            break;
          default:
            break;
        }
      });
    }
  }, [socket]);

  const handleSendOnClick = (_) => {
    const msg = chat.MSSGSend;
    const eMsg = encodeDesECB(msg, cryptoKey);
    console.log("sending encrypted message", eMsg);
    socket.emit("Mensaje ASCP", { function: 1, data: eMsg });
  };

  const handleMessageToSendOnChange = (e) => {
    e.preventDefault();
    setChat({ ...chat, MSSGSend: e.target.value });
  };

  const encodeDesECB = (textToEncode, keyString) => {
    var key = new Buffer(keyString.substring(0, 8), "utf8");

    var cipher = crypto.createCipheriv("des-ecb", key, "");

    var c = cipher.update(textToEncode, "utf8", "base64");
    c += cipher.final("base64");

    return c;
  };

  const decodeDesECB = (textToDecode, keyString) => {
    var key = new Buffer(keyString.substring(0, 8), "utf8");

    var decipher = crypto.createDecipheriv("des-ecb", key, "");

    var c = textToDecode;
    try {

      var c = decipher.update(textToDecode, "base64", "utf8");
      c += decipher.final("utf8");
    } catch {
      c = textToDecode
    }

    return c;
  };

  const calculateKey = (y) => {
    const x = parseInt(xValue);
    // let tempY = BigInt(BigInt(Math.pow(y, x)) % qValue);
    // console.log(tempY)
    // return tempY;
    const tempKey = bigInt(y).modPow(x, qValue).toString();
    console.log("la llave", tempKey)
    return tempKey;
    // return Math.pow(y, x) % qValue;
    // return powerMod(y, x, qValue).toString()
  };

  const powerMod = (base, exponent, modulus) => {
    if (modulus === 1) return 0;
    var result = 1;
    base = base % modulus;
    while (exponent > 0) {
      if (exponent % 2 === 1)
        //odd number
        result = (result * base) % modulus;
      exponent = exponent >> 1; //divide by 2
      base = (base * base) % modulus;
    }
    return result;
  }

  return (
    <Container>
      {`My key is ${cryptoKey}`}
      {cryptoKey === "" ? (
        <div>Waiting for the other key</div>
      ) : (
        <div>
          <Typography variant="h5"> {chat.ultimoMSSG} </Typography>
          <TextField
            name="chat"
            value={chat.MSSGSend}
            variant="outlined"
            onChange={handleMessageToSendOnChange}
          />
          <Button onClick={handleSendOnClick}>Send</Button>
        </div>
      )}
    </Container>
  );
};

export default Chat;
