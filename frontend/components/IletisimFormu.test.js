import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

describe("IletisimFormu component", () => {
  beforeEach(() => {
    render(<IletisimFormu />);
  });

  test("hata olmadan render ediliyor", () => {});

  test("iletişim formu headerı render ediliyor", () => {
    const header = screen.getByText("İletişim Formu");
    expect(header).toBeInTheDocument();
    expect(header).toBeVisible();
    expect(header).toBeTruthy();
  });

  test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
    const adInput = screen.getByLabelText("Ad*");
    fireEvent.change(adInput, { target: { value: "asd" } });
    // userEvent.type(adInput, "ilha");
    const errorMessage = screen.getByTestId("error");

    expect(errorMessage).toHaveTextContent("ad en az 5 karakter olmalıdır.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
    const btnSubmit = screen.getByText("Gönder");
    userEvent.click(btnSubmit);
    const errorMessages = screen.getAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  });

  test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
    const adInput = screen.getByLabelText("Ad*");
    const soyadInput = screen.getByLabelText("Soyad*");

    fireEvent.change(adInput, { target: { value: "asdasd" } });
    fireEvent.change(soyadInput, { target: { value: "asd" } });
    fireEvent.submit(screen.getByRole("button"));

    const errorMessage = screen.getByTestId("error");
    expect(errorMessage).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });

  test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    const emailInput = screen.getByLabelText("Email*");

    userEvent.type(emailInput, "abc");

    // fireEvent.change(emailInput, { target: { value: "asd" } });

    const errorMessage = screen.getByTestId("error");
    expect(errorMessage).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });

  test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    const adInput = screen.getByLabelText("Ad*");
    const emailInput = screen.getByLabelText("Email*");
    const btnSubmit = screen.getByText("Gönder");

    userEvent.type(adInput, "asdasd");
    userEvent.type(emailInput, "asd@asd.com");
    userEvent.click(btnSubmit);

    const errorMessage = screen.getByTestId("error");
    expect(errorMessage).toHaveTextContent("soyad gereklidir.");
  });

  test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
    const adInput = screen.getByLabelText("Ad*");
    const soyadInput = screen.getByLabelText("Soyad*");
    const emailInput = screen.getByLabelText("Email*");

    expect(adInput).toBeInTheDocument();
    expect(soyadInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    const errorMessage = screen.queryAllByTestId("error");
    expect(errorMessage).toHaveLength(0);
  });

  test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
    const adInput = screen.getByLabelText("Ad*");
    const soyadInput = screen.getByLabelText("Soyad*");
    const emailInput = screen.getByLabelText("Email*");
    const mesajInput = screen.getByLabelText("Mesaj");
    const submitButton = screen.getByRole("button");

    userEvent.type(adInput, "firstname");
    userEvent.type(soyadInput, "lastname");
    userEvent.type(emailInput, "test@email.com");
    userEvent.type(mesajInput, "Hello World!");

    fireEvent.click(submitButton);

    expect(adInput).toHaveValue("firstname");
    expect(soyadInput).toHaveValue("lastname");
    expect(emailInput).toHaveValue("test@email.com");
    expect(mesajInput).toHaveValue("Hello World!");
  });
});
