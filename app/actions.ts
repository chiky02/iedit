'use server';

import { prisma } from '@/lib/prisma';
import { createToken, setAuthCookie, verifyAuth, logout as logoutAuth } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

export async function loginAction(email: string, password: string) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return { error: 'Usuario o contraseña inválidos' };
    }

    const passwordMatch = await bcryptjs.compare(password, usuario.password);

    if (!passwordMatch) {
      return { error: 'Usuario o contraseña inválidos' };
    }

    const token = await createToken({
      userId: usuario.id,
      email: usuario.email,
    });

    await setAuthCookie(token);

    return { success: true };
  } catch (error) {
    console.error('Error en login:', error);
    return { error: 'Error al iniciar sesión' };
  }
}

export async function createIngresoAction(
  monto: number,
  descripcion: string,
  categoria: string,
  fecha: string
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return { error: 'No autorizado' };
    }

    const ingreso = await prisma.ingreso.create({
      data: {
        monto: parseFloat(monto.toString()),
        descripcion,
        categoria,
        fecha: new Date(fecha),
      },
    });

    return { success: true, ingreso };
  } catch (error) {
    console.error('Error al crear ingreso:', error);
    return { error: 'Error al crear ingreso' };
  }
}

export async function createGastoAction(
  monto: number,
  descripcion: string,
  categoria: string,
  fecha: string
) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return { error: 'No autorizado' };
    }

    const gasto = await prisma.gasto.create({
      data: {
        monto: parseFloat(monto.toString()),
        descripcion,
        categoria,
        fecha: new Date(fecha),
      },
    });

    return { success: true, gasto };
  } catch (error) {
    console.error('Error al crear gasto:', error);
    return { error: 'Error al crear gasto' };
  }
}

export async function getFinancialSummary() {
  try {
    const [ingresos, gastos] = await Promise.all([
      prisma.ingreso.findMany(),
      prisma.gasto.findMany(),
    ]);

    const totalIngresos = ingresos.reduce((sum, ing) => sum + Number(ing.monto), 0);
    const totalGastos = gastos.reduce((sum, gasto) => sum + Number(gasto.monto), 0);
    const saldo = totalIngresos - totalGastos;

    return {
      totalIngresos,
      totalGastos,
      saldo,
      ingresos,
      gastos,
    };
  } catch (error) {
    console.error('Error al obtener resumen financiero:', error);
    return { error: 'Error al obtener datos' };
  }
}

export async function logoutAction() {
  await logoutAuth();
  return { success: true };
}
