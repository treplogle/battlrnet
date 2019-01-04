using System;
using System.Collections.Concurrent;

namespace BattlrNet.Code.Game
{
    public class BufferManager
    {
        public static int TotalBuffersCreated { get; private set; }
        public int BufferSize { get; private set; } = 128;

        private readonly ConcurrentQueue<PooledBuffer> bufferQueue = new ConcurrentQueue<PooledBuffer>();
        
        public BufferManager()
        {

        }

        public PooledBuffer GetBuffer()
        {
            if (bufferQueue.Count > 0 && bufferQueue.TryDequeue(out PooledBuffer buffer))
            {
                buffer.Reset();
                return buffer;
            }

            TotalBuffersCreated++;
            return new PooledBuffer(this, BufferSize);
        }

        public void ReturnBuffer(PooledBuffer buffer)
        {
            if (buffer == null)
                return;

            bufferQueue.Enqueue(buffer);
        }
    }

    public class PooledBuffer : IDisposable
    {
        public byte[] Buffer { get; private set; }
        public BufferManager Manager { get; private set; }

        public PooledBuffer(BufferManager manager, int size)
        {
            Manager = manager;
            Buffer = new byte[size];
        }

        public void Reset()
        {
            Array.Clear(Buffer, 0, Buffer.Length);
            disposed = false;
        }

        private void ReturnToManager()
        {
            Manager.ReturnBuffer(this);
        }

        #region IDisposable
        private bool disposed = false;

        public void Dispose()
        {
            if (!disposed)
            {
                disposed = true;
                ReturnToManager();
            }
        }
        #endregion IDisposable
    }
}
