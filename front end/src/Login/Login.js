import {
  Button,
  Container,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useState } from "react";



const Login = ({
  handleTextFieldOnChange,
  handleLoginOnSubmit,
  server,
  xValue,
  startingConversation,
  handleChecked,
}) => {
  return (
    <Container maxWidth="md" style={{ paddingTop: 100  }}>
      {console.log(startingConversation)}
      <form onSubmit={handleLoginOnSubmit}>
        <Grid container justifyContent="right" rowSpacing={2}>
          <Grid item xs={12}>
            <TextField
              name="Servidos"
              value={server}
              label="donde deseas conectarte"
              onChange={handleTextFieldOnChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="Valor"
              value={xValue}
              label={`x value`}
              placeholder={`# < 2426697107`}
              onChange={handleTextFieldOnChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={startingConversation}
                  onChange={handleChecked}
                />
              }
              label="Quieres hablar?"
            />
          </Grid>
          <Button onClick={handleLoginOnSubmit}>Empieza ya</Button>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
