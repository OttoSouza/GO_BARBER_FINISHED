import React from "react"
import {render} from "react-native-testing-library"
import SignIn from "../../pages/SignIn"

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: jest.fn(),
  }
})

describe("SignIn Page", () => {
  it("should contains email/password inputs ", () => {
    const {getByPlaceholder} = render(<SignIn/>)

    const emailInput = getByPlaceholder("E-mail")
    const passowordInput = getByPlaceholder("Senha")

    expect(emailInput).toBeTruthy()
    expect(passowordInput).toBeTruthy()
  })
})

