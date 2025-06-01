import { render, screen } from "@testing-library/react"
import Login from "../../pages/Login"
import { MemoryRouter } from "react-router-dom"

describe("<Login />", () => {
  it("should render the login page", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    )

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()

    expect(
      screen.getByText(/Enter your credentials to access your account/i)
    ).toBeInTheDocument()

    expect(screen.getByRole("textbox", { name: /Email/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument()
  })
})
