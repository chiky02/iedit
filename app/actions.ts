'use server';

import { prisma } from '@/lib/prisma';
import { createToken, setAuthCookie, verifyAuth, logout as logoutAuth } from '@/lib/auth';
import bcryptjs from 'bcryptjs';

// --- LOGIN ---
export async function loginAction(email: string, password: string) {
  try {
    const usuario = await prisma.user.findUnique({
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

// --- LÓGICA DE TRANSACCIONES ---

// Función interna (no se exporta, no necesita ser async necesariamente, pero ayuda)
async function createTransaction(monto: number, descripcion: string, subcategoriaId: string, fecha: string) {
  try {
    const auth = await verifyAuth();
    if (!auth) return { error: 'No autorizado' };

    const transaccion = await prisma.transaccion.create({
      data: {
        monto: Number(monto),
        descripcion,
        fecha: new Date(fecha),
        usuarioId: auth.userId,
        subcategoriaId: subcategoriaId,
        estado: 'APROBADO'
      },
    });

    return { success: true, transaccion };
  } catch (error) {
    console.error('Error al crear transacción:', error);
    return { error: 'Error en la base de datos' };
  }
}

// CORRECCIÓN: Ahora son funciones async con nombre
export async function createIngresoAction(monto: number, desc: string, subId: string, fecha: string) {
  return await createTransaction(monto, desc, subId, fecha);
}

export async function createGastoAction(monto: number, desc: string, subId: string, fecha: string) {
  return await createTransaction(monto, desc, subId, fecha);
}

// --- RESUMEN ---
export async function getFinancialSummary() {
  try {
    const transacciones = await prisma.transaccion.findMany({
      include: {
        subcategoria: {
          include: { categoria: true }
        }
      }
    });

    const ingresos = transacciones.filter(t => t.subcategoria.categoria.tipo === 'INGRESO');
    const gastos = transacciones.filter(t => t.subcategoria.categoria.tipo === 'GASTO');

    const totalIngresos = ingresos.reduce((sum, t) => sum + Number(t.monto), 0);
    const totalGastos = gastos.reduce((sum, t) => sum + Number(t.monto), 0);
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